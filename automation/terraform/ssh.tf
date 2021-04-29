resource "tls_private_key" "main" {
  algorithm = "RSA"
}

resource "aws_key_pair" "main" {
  public_key = tls_private_key.main.public_key_openssh
}
