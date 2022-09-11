CREATE USER 'diary_user'@'%' IDENTIFIED BY 'diary_pass';
GRANT SELECT,INSERT,UPDATE,DELETE,EXECUTE,SHOW VIEW ON diary.* TO 'diary_user'@'%';
