# idwtf/management/commands/seed_realistic.py
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError

from idwtf.test.factories import FactFactory, LanguageFactory, ProfileFactory, TagFactory, UserFactory


class Command(BaseCommand):
    help = "Seed the database with realistic multilingual data using factory-boy."

    def handle(self, *args, **kwargs):
        # --- ADMIN USER AND PROFILE ---
        # create the super user
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(username="admin", email="admin@email.com", password="asdfggfdsa")
            self.stdout.write(self.style.SUCCESS("✅  Superuser 'admin' created successfully!"))
        else:
            self.stdout.write(self.style.WARNING("⚠️  Superuser 'admin' already exists."))

        # create profile for superuser
        superuser = User.objects.get(username="admin")
        try:
            profile_adm = ProfileFactory(user=superuser)
            self.stdout.write(self.style.SUCCESS("✅  Profile 'admin' created successfully!"))
        except IntegrityError:
            self.stdout.write(self.style.WARNING("⚠️  Skipped due to UNIQUE constraint"))

        # --- USERS ---
        user_slo = UserFactory(username="iAmSlovene")
        user_eng = UserFactory(username="iAmEnglish")
        user_ger = UserFactory(username="iAmGerman")
        self.stdout.write(self.style.SUCCESS("✅  Users created successfully!"))

        # --- PROFILES ---
        profile_slo = ProfileFactory(user=user_slo)
        profile_eng = ProfileFactory(user=user_eng)
        profile_ger = ProfileFactory(user=user_ger)
        self.stdout.write(self.style.SUCCESS("✅  Profiles created successfully!"))

        # --- LANGUAGES ---
        slovenian = LanguageFactory(code="sl", name="Slovenian", flag="🇸🇮")
        english = LanguageFactory(code="en", name="English", flag="🇺🇸")
        german = LanguageFactory(code="de", name="German", flag="🇩🇪")
        self.stdout.write(self.style.SUCCESS("✅  Languages created successfully!"))

        # --- TAGS ---
        # Slovenian tags
        slo_science = TagFactory(tag_name="znanost", profile=profile_slo, language=slovenian)
        slo_history = TagFactory(tag_name="zgodovina", profile=profile_slo, language=slovenian)
        slo_nature = TagFactory(tag_name="narava", profile=profile_slo, language=slovenian)

        # English tags
        eng_technology = TagFactory(tag_name="technology", profile=profile_eng, language=english)
        eng_space = TagFactory(tag_name="space", profile=profile_eng, language=english)
        eng_music = TagFactory(tag_name="music", profile=profile_eng, language=english)

        # German tags
        ger_geschichte = TagFactory(tag_name="Geschichte", profile=profile_ger, language=german)
        ger_naturwissenschaft = TagFactory(tag_name="Naturwissenschaft", profile=profile_ger, language=german)
        ger_kunst = TagFactory(tag_name="Kunst", profile=profile_ger, language=german)

        # Admin's tags
        TagFactory(tag_name="adm_tag_1", profile=profile_adm, language=english)
        TagFactory(tag_name="adm_tag_2", profile=profile_adm, language=english)
        TagFactory(tag_name="adm_tag_3", profile=profile_adm, language=english)

        self.stdout.write(self.style.SUCCESS("✅  Tags created successfully!"))

        # --- FACTS ---
        # Slovenian facts
        slo_fact_1 = FactFactory(
            profile=profile_slo,
            language=slovenian,
            visibility="public",
            content="Slovenia has over 10,000 caves, including the world-famous Postojna Cave.",
        )
        slo_fact_1.tags.add(slo_nature)

        slo_fact_2 = FactFactory(
            profile=profile_slo,
            language=slovenian,
            visibility="followers",
            content="The oldest wooden wheel in the world was discovered near Ljubljana, dating back over 5,000 years.",
        )
        slo_fact_2.tags.add(slo_history)

        slo_fact_3 = FactFactory(
            profile=profile_slo,
            language=slovenian,
            visibility="public",
            content="Slovenia is the only country with 'love' in its name — 'Slovenia'.",
        )
        slo_fact_3.tags.add(slo_science)

        # English facts
        eng_fact_1 = FactFactory(
            profile=profile_eng,
            language=english,
            visibility="public",
            content="The first photo of a black hole was captured in 2019, showing the one in galaxy M87.",
        )
        eng_fact_1.tags.add(eng_space)

        eng_fact_2 = FactFactory(
            profile=profile_eng,
            language=english,
            visibility="followers",
            content="The word 'robot' comes from the Czech word 'robota', meaning 'forced labor'.",
        )
        eng_fact_2.tags.add(eng_technology)

        eng_fact_3 = FactFactory(
            profile=profile_eng,
            language=english,
            visibility="public",
            content="Beethoven continued to compose music even after going completely deaf.",
        )
        eng_fact_3.tags.add(eng_music)

        # German facts
        ger_fact_1 = FactFactory(
            profile=profile_ger,
            language=german,
            visibility="public",
            content="Die Berliner Mauer fiel am 9. November 1989, was das Ende der DDR einleitete.",
        )
        ger_fact_1.tags.add(ger_geschichte)

        ger_fact_2 = FactFactory(
            profile=profile_ger,
            language=german,
            visibility="followers",
            content="Albert Einstein wurde in Ulm geboren und formulierte die Relativitätstheorie.",
        )
        ger_fact_2.tags.add(ger_naturwissenschaft)

        ger_fact_3 = FactFactory(
            profile=profile_ger,
            language=german,
            visibility="public",
            content="Deutschland hat über 1.500 verschiedene Biersorten.",
        )
        ger_fact_3.tags.add(ger_kunst)
        self.stdout.write(self.style.SUCCESS("✅  Facts created successfully!"))

        # --- FOLLOWING LOGIC ---
        # German does not follow any tag
        # Slovene follows one English tag
        profile_slo.follows.add(eng_space)

        # English follows two Slovene tags
        profile_eng.follows.add(slo_science)
        profile_eng.follows.add(slo_history)
        self.stdout.write(self.style.SUCCESS("✅  Following relationships created successfully!"))

        self.stdout.write(self.style.SUCCESS("🎉  Database seeded with realistic multilingual data!"))
