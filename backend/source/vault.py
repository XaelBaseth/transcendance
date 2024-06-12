import hvac
import os
import logging

logging.basicConfig(level=logging.DEBUG)

def get_vault_client():
	role_id = os.environ.get('DJANGO_ROLE_ID')
	secret_id = os.environ.get('DJANGO_SECRET_ID')
	
	client = hvac.Client(url=os.environ.get('VAULT_ADDR'), verify='/etc/ssl/certs/ca.crt')

	try:
		client.auth.approle.login(role_id=role_id, secret_id=secret_id)
	except Exception as e:
		raise ValueError(f"Failed to authenticate with Vault: {e}")
	
	return client

def fetch_secrets_from_vault(path):
	client = get_vault_client()
	secrets = None

	try:
		secrets = client.secrets.kv.v2.read_secret_version(
			mount_point='secret', 
			path=path,
		)
		return secrets['data']['data']
	except Exception as e:
		logging.error(f"Exception caught: {e}")
		raise ValueError(f"Failed to fetch secrets from Vault: {e}")
