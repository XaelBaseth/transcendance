FROM hashicorp/vault:1.11.3

COPY ./vault-config.json /vault/config/vault-config.json
COPY ./unseal_vault.sh /unseal_vault.sh
RUN chmod +x /unseal_vault.sh
EXPOSE 8200

ENTRYPOINT [ "/unseal_vault.sh" ]