# Global external HTTPS load balancer in front of the frontend Cloud Run
# service. It was originally created outside this repo; the import blocks below
# adopt the live resources so they are tracked here (they are no-ops once the
# resources are in state and can then be deleted).
#
# Domains are served by several Google-managed certificates attached to the
# same HTTPS proxy. Managed certificates can't be edited in place, so adding a
# domain means adding another certificate (existing ones keep serving, no
# downtime).

import {
  to = google_compute_global_address.frontend
  id = "projects/${var.project_id}/global/addresses/zenflow-frontend-lb-ip"
}

import {
  to = google_compute_region_network_endpoint_group.frontend
  id = "projects/${var.project_id}/regions/${var.region}/networkEndpointGroups/zenflow-frontend-neg"
}

import {
  to = google_compute_backend_service.frontend
  id = "projects/${var.project_id}/global/backendServices/zenflow-frontend-backend"
}

import {
  to = google_compute_url_map.frontend
  id = "projects/${var.project_id}/global/urlMaps/zenflow-frontend-lb"
}

import {
  to = google_compute_url_map.frontend_http_redirect
  id = "projects/${var.project_id}/global/urlMaps/zenflow-frontend-http-redirect"
}

import {
  to = google_compute_managed_ssl_certificate.frontend
  id = "projects/${var.project_id}/global/sslCertificates/zenflow-frontend-cert"
}

import {
  to = google_compute_managed_ssl_certificate.wavez
  id = "projects/${var.project_id}/global/sslCertificates/wavez-cert"
}

import {
  to = google_compute_target_https_proxy.frontend
  id = "projects/${var.project_id}/global/targetHttpsProxies/zenflow-frontend-https-proxy"
}

import {
  to = google_compute_target_http_proxy.frontend
  id = "projects/${var.project_id}/global/targetHttpProxies/zenflow-frontend-http-proxy"
}

import {
  to = google_compute_global_forwarding_rule.frontend_https
  id = "projects/${var.project_id}/global/forwardingRules/zenflow-frontend-https"
}

import {
  to = google_compute_global_forwarding_rule.frontend_http
  id = "projects/${var.project_id}/global/forwardingRules/zenflow-frontend-http"
}

resource "google_compute_global_address" "frontend" {
  name    = "zenflow-frontend-lb-ip"
  project = var.project_id
}

resource "google_compute_region_network_endpoint_group" "frontend" {
  name                  = "zenflow-frontend-neg"
  project               = var.project_id
  region                = var.region
  network_endpoint_type = "SERVERLESS"

  cloud_run {
    service = google_cloud_run_v2_service.frontend.name
  }
}

resource "google_compute_backend_service" "frontend" {
  name     = "zenflow-frontend-backend"
  project  = var.project_id
  protocol = "HTTPS"

  load_balancing_scheme = "EXTERNAL"

  backend {
    group = google_compute_region_network_endpoint_group.frontend.id
  }
}

resource "google_compute_url_map" "frontend" {
  name            = "zenflow-frontend-lb"
  project         = var.project_id
  default_service = google_compute_backend_service.frontend.id
}

# Existing certificates, added over time for zenflow.zenika.com / wavez.zenika.com.
resource "google_compute_managed_ssl_certificate" "frontend" {
  name    = "zenflow-frontend-cert"
  project = var.project_id

  managed {
    domains = ["zenflow.zenika.com"]
  }
}

resource "google_compute_managed_ssl_certificate" "wavez" {
  name    = "wavez-cert"
  project = var.project_id

  managed {
    domains = ["wavez.zenika.com", "zenflow.zenika.com"]
  }
}

# wavez.org. Only issued once the DNS A records for these domains point at
# `load_balancer_ip`.
resource "google_compute_managed_ssl_certificate" "wavez_org" {
  name    = "wavez-org-cert"
  project = var.project_id

  managed {
    domains = ["wavez.org", "www.wavez.org"]
  }
}

resource "google_compute_target_https_proxy" "frontend" {
  name    = "zenflow-frontend-https-proxy"
  project = var.project_id
  url_map = google_compute_url_map.frontend.id
  ssl_certificates = [
    google_compute_managed_ssl_certificate.frontend.id,
    google_compute_managed_ssl_certificate.wavez.id,
    google_compute_managed_ssl_certificate.wavez_org.id,
  ]
}

resource "google_compute_global_forwarding_rule" "frontend_https" {
  name    = "zenflow-frontend-https"
  project = var.project_id

  load_balancing_scheme = "EXTERNAL"
  ip_address            = google_compute_global_address.frontend.id
  port_range            = "443"
  target                = google_compute_target_https_proxy.frontend.id
}

# Plain-HTTP requests are redirected to HTTPS.
resource "google_compute_url_map" "frontend_http_redirect" {
  name    = "zenflow-frontend-http-redirect"
  project = var.project_id

  default_url_redirect {
    https_redirect = true
    strip_query    = false
  }
}

resource "google_compute_target_http_proxy" "frontend" {
  name    = "zenflow-frontend-http-proxy"
  project = var.project_id
  url_map = google_compute_url_map.frontend_http_redirect.id
}

resource "google_compute_global_forwarding_rule" "frontend_http" {
  name    = "zenflow-frontend-http"
  project = var.project_id

  load_balancing_scheme = "EXTERNAL"
  ip_address            = google_compute_global_address.frontend.id
  port_range            = "80"
  target                = google_compute_target_http_proxy.frontend.id
}
