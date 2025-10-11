from django.core.exceptions import ValidationError
from django.db.models.signals import m2m_changed
from django.dispatch import receiver

from idwtf.models import Fact


@receiver(m2m_changed, sender=Fact.tags.through)
def validate_fact_tags(sender, instance, action, pk_set, **kwargs):
    """
    Validate that tags belong to the fact's profile when adding tags.

    Works for both directions:
    - fact.tags.add(tag)  → instance is Fact
    - tag.facts.add(fact) → instance is Tag

    Args:
        sender: The intermediate model (Fact.tags.through)
        instance: Either a Fact or Tag instance (depends on which side initiated)
        action: The type of change ('pre_add', 'post_add', 'pre_remove', etc.)
        pk_set: Set of primary keys being added/removed
        **kwargs: Additional keyword arguments from the signal (e.g., 'using', 'model')

    """
    # Only validate when adding
    if action != "pre_add":
        return

    from idwtf.models import Fact, Tag

    # Determine which direction the relationship is being modified
    if isinstance(instance, Fact):
        # fact.tags.add(tag1, tag2, ...)
        fact = instance
        tags = Tag.objects.filter(pk__in=pk_set)

        invalid_tags = tags.exclude(profile=fact.profile)
        if invalid_tags.exists():
            invalid_names = ", ".join(invalid_tags.values_list("tag_name", flat=True))
            raise ValidationError(
                f"Cannot add tags from other profiles: {invalid_names}. "
                f"All tags must belong to user '{fact.profile.user.username}'."
            )

    elif isinstance(instance, Tag):
        # tag.facts.add(fact1, fact2, ...)
        tag = instance
        facts = Fact.objects.filter(pk__in=pk_set)

        invalid_facts = facts.exclude(profile=tag.profile)
        if invalid_facts.exists():
            invalid_users = ", ".join(invalid_facts.values_list("profile__user__username", flat=True))
            raise ValidationError(
                f"Cannot add facts from other users: {invalid_users}. "
                f"Tag '{tag.tag_name}' belongs to user '{tag.profile.user.username}'."
            )
