output "artifact_registry_repository" {
  description = "Docker push target, e.g. <output>/backend:TAG"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.zenflow.repository_id}"
}

output "backend_url" {
  description = "Public URL of the deployed backend Cloud Run service."
  value       = google_cloud_run_v2_service.backend.uri
}

output "frontend_url" {
  description = "Public URL of the deployed frontend Cloud Run service."
  value       = google_cloud_run_v2_service.frontend.uri
}

output "frontend_lb_ip" {
  description = "Static IP of the load balancer; use it for the DNS A records of every served domain (e.g. wavez.org, www.wavez.org at GoDaddy)."
  value       = google_compute_global_address.frontend.address
}
