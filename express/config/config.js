require('dotenv').config();//instatiate environment variables

CONFIG = {} //Make this global to use all over the application

CONFIG.app = process.env.APP || 'dev';
CONFIG.port = process.env.PORT || '4000';
CONFIG.hostUrl = process.env.HOSTURL || 'dev.winspect.centizenapps.com';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mysql';
CONFIG.db_host = process.env.DB_HOST || 'localhost';
CONFIG.db_port = process.env.DB_PORT || '3306';
CONFIG.db_name = process.env.DB_NAME || 'windInspection';
CONFIG.max_device_limit = process.env.MAX_DEVICE_LIMIT || 10;

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'please_change';
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '10000';

CONFIG.mail_server = process.env.MAIL_SERVER || 'email-smtp.us-west-2.amazonaws.com'
CONFIG.mail_server_port = process.env.MAIL_SERVER_PORT || '465'

CONFIG.max_pool_conn = process.env.MAX_POOL_CONN || '100';
CONFIG.min_pool_conn = process.env.MIN_POOL_CONN || '0';
CONFIG.conn_idle_time = process.env.CONN_IDLE_TIME || '10000';

CONFIG.aws_bucket_name = process.env.AWS_BUCKET_NAME || 'centizen-winspect';
CONFIG.aws_img_dir_name = process.env.AWS_IMG_DIR_NAME || 'uploadedImage/';
CONFIG.aws_pdf_dir_name = process.env.AWS_PDF_DIR_NAME || 'pdf/';
CONFIG.aws_logo_dir_name = process.env.AWS_LOGO_DIR_NAME || 'logo/';
CONFIG.region = process.env.AWS_REGION || 'us-west-2';


CONFIG.aws_mysql_conf_key = process.env.AWS_MYSQL_CONF_KEY || 'mysql-config';
CONFIG.aws_mailserver_conf_key = process.env.AWS_MAILSERVER_CONF_KEY || 'mailserver-config';
CONFIG.aws_jwt_conf_key = process.env.AWS_JWT_CONF_KEY || 'jwt-config';

CONFIG.readPermissionId = 1;
CONFIG.activeStatusId = 1;