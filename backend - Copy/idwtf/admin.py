# from django.contrib import admin

# # from .models import Profile, Fact
# from . import models

# # Register your models here.
# for model in [
#     models.Profile,
#     models.Tag,
#     models.Language,
#     models.Fact,
# ]:
#     admin.site.register(model)

from django.contrib import admin

from .models import Fact, Language, Profile, Tag

admin.site.register(Profile)
admin.site.register(Tag)
admin.site.register(Language)
admin.site.register(Fact)
