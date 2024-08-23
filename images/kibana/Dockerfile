# Use the official Kibana image as the base image
FROM docker.elastic.co/kibana/kibana:8.6.0

COPY ./config/kibana.yml /usr/share/kibana/config/kibana.yml

# Expose the Kibana port
EXPOSE 5601

# Start Kibana
CMD ["bin/kibana"]