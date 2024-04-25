1. Creer une `views` dans 'views.py'

```
from django.http import JsonResponse

def test_backend(request):
    return JsonResponse({"message": "Backend is working!"})
```

2. Ajouter l'url dans `url.py`
```
from django.urls import path
from .views import test_backend

urlpatterns = [
    # Other URL patterns...
    path('test-backend/', test_backend, name='test_backend'),
]
```
3. Recuperer les datas via `axios` dans le front end

```
axios.get('/test-backend/')
 .then(response => console.log(response.data));
```

4. Configurer nginx dans `nginx_https.conf` pour proxy les requetes django

```
location /test-backend/ {
    proxy_pass http://django:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Checker le site avec f12 sur la page `/` pour voir a quoi ca ressemble.