listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_cert_file = "/etc/vault/certs/nginx.crt"
  tls_key_file = "/etc/vault/private/nginx.key"
}

storage "file" {
  path = "/vault/file"
}

api_addr = "https://127.0.0.1:8200"
ui = true
disable_mlock = "true"
log_requests_level = "trace"