# idwtf/management/commands/seed.py
from django.core.management.base import BaseCommand

from idwtf.test.factories import FactFactory, LanguageFactory, ProfileFactory, TagFactory, UserFactory


class Command(BaseCommand):
    help = "Seed the database with realistic data using factory-boy."

    def handle(self, *args, **kwargs):
        # create users
        user_creator_en = UserFactory(username="iAmCreatorEN")
        user_creator_de = UserFactory(username="iAmCreatorDE")
        user_follower = UserFactory(username="iAmFollower")
        self.stdout.write(self.style.SUCCESS("✅  Users created successfully!"))

        # create profiles
        profile_creator_en = ProfileFactory(user=user_creator_en)
        profile_creator_de = ProfileFactory(user=user_creator_de)
        profile_follower = ProfileFactory(user=user_follower)
        self.stdout.write(self.style.SUCCESS("✅  Profiles created successfully!"))

        # create languages
        english = LanguageFactory(code="en")
        german = LanguageFactory(code="de")
        self.stdout.write(self.style.SUCCESS("✅  Languages created successfully!"))

        # creating tags
        en_science = TagFactory(tag_name="science", profile=profile_creator_en)
        en_marin_biology = TagFactory(tag_name="marin biology", profile=profile_creator_en)
        de_wissenschaft = TagFactory(tag_name="Wissenschaft", profile=profile_creator_de)  # science
        de_geschichte = TagFactory(tag_name="Geschichte", profile=profile_creator_de)  # history
        self.stdout.write(self.style.SUCCESS("✅  Tags created successfully!"))

        # create facts
        fact_en_1 = FactFactory(profile=profile_creator_en, language=english, visibility="followers")
        fact_en_2 = FactFactory(profile=profile_creator_en, language=english, visibility="followers")
        fact_de_1 = FactFactory(profile=profile_creator_de, language=german, visibility="followers")
        fact_de_2 = FactFactory(profile=profile_creator_de, language=german, visibility="followers")
        fact_en_1.tags.add(en_science)
        fact_en_2.tags.add(en_marin_biology)
        fact_de_1.tags.add(en_marin_biology)
        fact_de_2.tags.add(de_wissenschaft)
        self.stdout.write(self.style.SUCCESS("✅  Facts created successfully!"))

        # define following
        profile_follower.follows.add(en_science)
        profile_follower.follows.add(en_marin_biology)
        profile_follower.follows.add(de_wissenschaft)
        profile_follower.follows.add(de_geschichte)
        self.stdout.write(self.style.SUCCESS("✅  Following added successfully!"))
