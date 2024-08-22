FROM docker.elastic.co/logstash/logstash:7.14.0

# Add your Logstash configuration file
COPY ./pipeline/logstash.conf /usr/share/logstash/pipeline/logstash.conf

# Start Logstash
CMD ["logstash", "-f", "/usr/share/logstash/pipeline/logstash.conf"]