FROM hashicorp/vault:1.16

WORKDIR /
RUN mkdir -p script/
COPY ./vault-config.hcl /vault/config/vault-config.hcl
COPY ./unseal_vault.sh script/unseal_vault.sh

EXPOSE 8200


COPY ./entrypoint.sh script/entrypoint.sh
RUN chmod +x script/entrypoint.sh

ENTRYPOINT [ "sh", "/script/entrypoint.sh" ]