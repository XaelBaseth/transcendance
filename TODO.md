HasicorpVault !
fix front :
	- settings CSS
	- creation Room pour tournois
	- handle settings
2FA

Vault
https://france.devoteam.com/paroles-dexperts/hashicorp-vault/
https://github.com/minthe/ft_transcendence/blob/main/docker-compose.yml
Vault est un gestionnaire de secret => set de differents accreditation soit Authentification a un systeme ou Authorisation a un systeme (username/password; db credentials; api token; TLS certs)
|-> On veut comprendre qui a acces a ces secrets, et qui les manages
|-> Gerer le secret sprawl (leak de creds et tracage)
||
==> Vault centralise les infos sensibles et les encrypte puis les redistribuent correctement et a un systeme d'audit
==> Dynamique secrets (creds a date limite; mdp unique par serveur; revocation simplifie)
==> Cle d'encryption pour les DB (encrypt as a service -> named key & high level API to encrypt, sign, verify & key life cycle)
==> High level architecture (heavily pluginable)


2FA
https://www.phind.com/search?cache=gr0vyru1exwk3rzcnim70n5m


command to test if WAF is enabled:
https://localhost:8000/aphpfilethatdonotexist.php?something=../../etc