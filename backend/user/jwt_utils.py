import jwt
from datetime import datetime, timedelta

# Clé secrète pour signer le JWT (à remplacer par votre propre clé)
SECRET_KEY = "your_secret_key_here"

# Fonction pour générer un JWT pour un utilisateur
def generate_jwt(user_id, username, role):
    # Informations à inclure dans le JWT
    payload = {
        'user_id': user_id,
        'username': username,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=1)  # Date d'expiration du JWT
    }
    
    # Génération du JWT
    jwt_token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    
    return jwt_token
