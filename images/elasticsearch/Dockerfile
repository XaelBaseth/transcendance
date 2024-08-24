ARG ELASTIC_VERSION

# https://www.docker.elastic.co/
FROM docker.elastic.co/elasticsearch/elasticsearch:${ELASTIC_VERSION}

# Copy the setup script and any required files
COPY setup_user.sh /usr/share/elasticsearch/setup_user.sh
COPY lib.sh /usr/share/elasticsearch/lib.sh
COPY role /usr/share/elasticsearch/roles/

# Set the necessary permissions
#RUN chmod +x /usr/share/elasticsearch/setup_user.sh

# Execute the script
RUN /usr/share/elasticsearch/setup_user.sh