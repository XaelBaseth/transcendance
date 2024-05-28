FROM hashicorp/vault:1.16

WORKDIR /
RUN mkdir -p script/
COPY ./vault-config.hcl /vault/config/vault-config.hcl

# Install curl using apk (Alpine package manager)
RUN apk update && apk add curl

EXPOSE 8200

COPY ./entrypoint.sh script/entrypoint.sh
RUN chmod +x script/entrypoint.sh

ENTRYPOINT [ "sh", "/script/entrypoint.sh" ]
