# Modesecurity pour Nginx & Hashicorp Vault

## ModSecurity pour Nginx

ModSecurity est une plateforme open-source d'application web de sécurité (WAF) qui peut être utilisée avec divers serveurs web comme Apache, IIS, et Nginx. Pour Nginx, il s'agit d'un module qui permet de filtrer les requêtes HTTP en fonction de règles de sécurité définies par l'utilisateur ou fournies par des communautés tiers. Ces règles peuvent détecter et bloquer des attaques courantes telles que les injections SQL, les cross-site scripting (XSS), les attaques par force brute, et bien d'autres.

### Configuration de base

Après avoir installé ModSecurity, vous devez configurer les règles de sécurité. Les règles sont stockées dans des fichiers .conf situés dans le répertoire /etc/modsecurity. Vous pouvez commencer par utiliser les règles de base fournis par ModSecurity ou ajouter vos propres règles.

nginx/default.conf:

	# Including ModSecurity rules
	modsecurity on;
		modsecurity_rules_file /etc/nginx/modsec/main.conf;

Cette configuration active ModSecurity et indique à Nginx d'utiliser le fichier de configuration recommandé par ModSecurity.

Ici on utilise les regles ```crs (OWASP ModSecurity Core Rule Set)``` afin d'avoir une configuration stricte.

### Testez ModSecurity

Pour tester si ModSecurity fonctionne correctement sur votre serveur Nginx, vous pouvez créer des tests manuels en envoyant des requêtes malveillantes à votre serveur et en vérifiant si ModSecurity bloque ces requêtes.

Exemple de test manuel

    Créez une requête malveillante. Par exemple, une tentative d'injection SQL pourrait ressembler à ceci : https://localhost:8000/login?query=1' OR '1'='1'
    Envoyez cette requête à votre serveur via un navigateur ou un outil comme curl : curl -s https://localhost:8000/login?query=1' OR '1'='1'

Vérifiez la réponse. Si ModSecurity est correctement configuré, il devrait bloquer la requête et renvoyer une erreur 403 (Forbidden).

### Conclusion

ModSecurity est un outil puissant pour améliorer la sécurité de vos applications web sur Nginx. En suivant les étapes d'installation et de configuration décrites ci-dessus, vous pouvez commencer à protéger votre serveur contre une variété d'attaques web courantes. N'oubliez pas de régulièrement mettre à jour les règles de ModSecurity pour rester à jour face aux nouvelles menaces.

## HashiCorp Vault

HashiCorp Vault est un outil conçu pour sécuriser, stocker et gérer de manière centralisée les secrets numériques, tels que les clés API, les mots de passe, les certificats et autres informations sensibles. Il offre une interface unifiée pour accéder à n'importe quel secret tout en fournissant un contrôle d'accès strict et en enregistrant un journal d'audit détaillé. Contrairement à d'autres solutions de gestion de secrets, Vault est conçu pour offrir une flexibilité élevée dans la gestion des secrets, y compris leur rotation automatique et leur intégration avec d'autres systèmes et applications.
Installation de Vault

### Configuration de Base de Vault

Après l'installation, vous devez initialiser Vault avant de pouvoir l'utiliser. L'initialisation crée un ensemble de clés partagées nécessaires pour démarrer Vault. Voici les étapes de base pour initialiser et démarrer Vault :

  Initialisez Vault. Cela génère un ensemble de clés partagées nécessaires pour démarrer Vault.

	vault operator init

  Démarrer Vault. Vous pouvez démarrer Vault en tant que service système ou en exécutant simplement le binaire vault.

	vault server -config=/path/to/config.hcl

  Configurer Vault. Créez un fichier de configuration config.hcl (ou config.json) avec les paramètres appropriés pour votre environnement. Un exemple de configuration simple pourrait ressembler à ceci :

	listener "tcp" {
	address = "0.0.0.0:8200"
	tls_disable = 1
	}

	storage "file" {
	path = "/path/to/data"
	}

	ui = true

  Accédez à l'interface utilisateur Web de Vault. Une fois que Vault est démarré, vous pouvez accéder à son interface utilisateur Web à l'adresse ```http://<VAULT_IP>:8200/ui.```

### Testez Vault

Pour tester si Vault fonctionne correctement, vous pouvez essayer de stocker et de récupérer un secret. Voici comment :

Stockez un secret. Utilisez la commande vault kv put pour stocker un secret dans le stockage KV.

	vault kv put secret/mysecret password="my-password"

Récupérez le secret. Utilisez la commande vault kv get pour récupérer le secret que vous avez stocké.

	vault kv get secret/mysecret

Ces étapes vous permettent de vérifier que Vault est correctement installé, configuré et opérationnel. Vous pouvez ensuite explorer davantage ses fonctionnalités, notamment l'intégration avec des moteurs de secrets, la gestion des politiques d'accès, et l'utilisation de différentes méthodes d'authentification.
