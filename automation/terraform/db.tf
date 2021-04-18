variable "db_username" {
  description = "The username for the DB master user"
  type        = string
}

variable "db_password" {
  description = "The password for the DB master user"
  type        = string
}

resource "aws_db_instance" "main" {
  allocated_storage    = 10
  engine               = "mysql"
  instance_class       = "db.t3.micro"
  name                 = "stp_prod"
  username             = var.db_username
  password             = var.db_password
  db_subnet_group_name = aws_db_subnet_group.main.name
}
