FROM docker.elastic.co/elasticsearch/elasticsearch:8.15.0

USER root

# Copy the certificate generation script and entrypoint script
COPY ./elasticsearch/generate_certs.sh /usr/share/elasticsearch/scripts/generate_certs.sh
COPY ./elasticsearch/entrypoint.sh /usr/share/elasticsearch/scripts/entrypoint.sh

# Make the scripts executable
RUN chmod +x /usr/share/elasticsearch/scripts/generate_certs.sh
RUN chmod +x /usr/share/elasticsearch/scripts/entrypoint.sh

# Generate the certificates
RUN /usr/share/elasticsearch/scripts/generate_certs.sh

# Ensure the volume directory is created in the container
RUN mkdir -p /usr/share/elasticsearch/config/certs
RUN mkdir -p /usr/share/elasticsearch/config/volume

# Copy elasticsearch.yml
COPY ./elasticsearch/elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

RUN chown -R elasticsearch:elasticsearch /usr/share/elasticsearch/config/certs/
RUN chown -R elasticsearch:elasticsearch /usr/share/elasticsearch/data

RUN chmod -R 775 /usr/share/elasticsearch/data
RUN chmod -R 775 /usr/share/elasticsearch/config/certs

USER elasticsearch

# Set entrypoint script
ENTRYPOINT ["/usr/share/elasticsearch/scripts/entrypoint.sh"]
