FROM docker.elastic.co/logstash/logstash:8.6.0

# Add your Logstash configuration file
COPY ./pipeline/logstash.conf /usr/share/logstash/pipeline/logstash.conf
COPY ./config/logstash.yml /usr/share/logstash/config/logstash.yml

# Expose the Logstash port
EXPOSE 5044

# Start Logstash
CMD ["bin/logstash", "-f", "/usr/share/logstash/pipeline/logstash.conf"]