from textwrap import dedent

import pytz
from django.core.management.base import BaseCommand
from django.utils import timezone

from idwtf.models import Language, Profile
from idwtf.test.factories import FactFactory, TagFactory


class Command(BaseCommand):
    help = "Seed some real facts data using factory-boy."

    def handle(self, *args, **kwargs):
        # get profile
        profile_adm = Profile.objects.get(user__username="admin@email.com")
        profile_adm.username = "Simon"
        profile_adm.save()

        # set timezone
        tz = pytz.timezone("Europe/Ljubljana")
        # tz = pytz.timezone("Europe/Brussels")

        # get languages
        slovenian_language = Language.objects.get(code="sl")
        english_language = Language.objects.get(code="en")

        # create tags
        slo_sluzba = TagFactory(tag_name="sluzba", profile=profile_adm, language=slovenian_language)
        slo_dobro_zivljenje = TagFactory(tag_name="dobro zivljenje", profile=profile_adm, language=slovenian_language)

        # create facts template
        '''
        f = FactFactory(
            profile=profile_adm,
            content=dedent("""
                Fact multiline content.
            """).strip(),  # remove extra leading/trailing newlines,
            source="e.g.: www.fact-source.com; friend of mine; [Link text](www.example.com)",
            visibility="public",
            language=slovenian_language,
        )
        f.tags.add(slo_sluzba)
        f.created_at = timezone.datetime(YYYY, MM, DD, HH, MM, tzinfo=tz)
        f.save()
        '''

        # my facts ----------------------------------------------------------------------------------------------------
        f = FactFactory(
            profile=profile_adm,
            content=dedent("""
                V podjetju prijatelja se jim ob koncu leta briše dopust, če ga ne porabijo.
                Imajo pa možnost tekom leta iti do 5 dni v minus.
                Ob novem letu se briše tudi ta minus.

                Še nekaj:
                Če greš v minus npr. le 3 dni, imaš naslednje leto možnost minusa le tri dni.

                In bolniško odsotnost in nego imajo plačano 100 %.
            """).strip(),
            source="Zasebni vir, povedal bivši lastnik podjetja, B. Š.",
            visibility="public",
            language=slovenian_language,
        )
        f.tags.add(slo_sluzba)
        f.created_at = timezone.datetime(2025, 12, 16, 19, 00, tzinfo=tz)
        f.save()
        self.stdout.write(self.style.SUCCESS(f"✅  Fact created successfully! {f.content[:50]}"))

        f = FactFactory(
            profile=profile_adm,
            content=dedent("""
                David Zupančič: Če me vprašaš kaj je pekel... Pustimo mlake lave kjer gorijo grešniki...

                Ko ti parkirajo nekega gospoda na urgenci in tam čaka izvide v kotu, starejši gospod. In on šteje.
                Ena, dva, tri, pride do 20 in spet šteje od ena.
                Kognitivni upad je zelo napredoval, demenca. Pogovarja se z mamo, ki je ni že 20 let.

                Vse kar me veseli v življenju je bazirano na nekem intelektu... Branje, pisanje, zdravniška služba, družina, ljubezen.

                Upadanje, usihanje tega, ko telo usiha počasneje kot zavest, to se mi zdi prekletstvo.
            """).strip(),
            source="[Mihilizem - David Zupančič: Vsak večer berem poezijo](https://podcastaddict.com/mihilizem/episode/183894625)",
            visibility="public",
            language=slovenian_language,
        )
        f.tags.add(slo_dobro_zivljenje)
        f.created_at = timezone.datetime(2025, 12, 18, 13, 00, tzinfo=tz)
        f.save()
        self.stdout.write(self.style.SUCCESS(f"✅  Fact created successfully! {f.content[:50]}"))
