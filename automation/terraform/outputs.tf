resource "local_file" "inventory" {
  content = templatefile("inventory.tpl",
    {
      jenkins_dns = aws_instance.jenkins.public_dns,
    }
  )
  filename = "../ansible/inventory"
}

resource "local_file" "key" {
  content         = tls_private_key.main.private_key_pem
  filename        = "../ansible/key.pem"
  file_permission = "0400"
}
