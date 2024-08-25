FROM docker.elastic.co/elasticsearch/elasticsearch:8.15.0

USER root

# Copy the certificate generation script and entrypoint script
COPY ./elasticsearch/generate_certs.sh /usr/share/elasticsearch/scripts/generate_certs.sh
COPY ./elasticsearch/entrypoint.sh /usr/share/elasticsearch/scripts/entrypoint.sh

# Make the scripts executable
RUN chmod +x /usr/share/elasticsearch/scripts/generate_certs.sh
RUN chmod +x /usr/share/elasticsearch/scripts/entrypoint.sh

# Ensure the volume directory is created in the container
RUN mkdir -p /usr/share/elasticsearch/config/certs

# Copy elasticsearch.yml
COPY ./elasticsearch/elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

USER elasticsearch
# Set entrypoint script
ENTRYPOINT ["/usr/share/elasticsearch/scripts/entrypoint.sh"]
