HasicorpVault ! => Handle HTTPS and .env
fix front :
	- settings CSS
	- creation Room pour tournois
	- handle settings
2FA

Vault
https://france.devoteam.com/paroles-dexperts/hashicorp-vault/
https://github.com/minthe/ft_transcendence/blob/main/docker-compose.yml
https://developer.hashicorp.com/vault/tutorials/operations/configure-vault
https://github.com/ahmetkaftan/docker-vault

Vault est un gestionnaire de secret => set de differents accreditation soit Authentification a un systeme ou Authorisation a un systeme (username/password; db credentials; api token; TLS certs)
|-> On veut comprendre qui a acces a ces secrets, et qui les manages
|-> Gerer le secret sprawl (leak de creds et tracage)
||
==> Vault centralise les infos sensibles et les encrypte puis les redistribuent correctement et a un systeme d'audit
==> Dynamique secrets (creds a date limite; mdp unique par serveur; revocation simplifie)
==> Cle d'encryption pour les DB (encrypt as a service -> named key & high level API to encrypt, sign, verify & key life cycle)
==> High level architecture (heavily pluginable)

Vault est maintenant initialize, et les cles de scellement sont mise en place. Reste a store les credential du .env dans le vault et a le link au back et front

Utilise consul pour la persistance des datas ?

vault store secret =========> db credentials & api key
	||								||
	\/								\/
vault need .env to works	stored in .env
	||								||
	\/								\/
.env with only vault key =====> stored in vault ?
									||
									\/
								where to store at the beginning
								for a 1st run ?
									||
									\/
								Hard coded to the init-vault.sh ==> NONO
	

Tentative de setup https, a check !

2FA
https://www.phind.com/search?cache=gr0vyru1exwk3rzcnim70n5m


command to test if WAF is enabled:
https://localhost:8000/aphpfilethatdonotexist.php?something=../../etc