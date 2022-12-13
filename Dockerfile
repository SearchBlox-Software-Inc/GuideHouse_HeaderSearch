FROM centos:latest

RUN yum -y install httpd

COPY ./httpd.conf /etc/httpd/conf/httpd.conf

COPY ./dist/* /var/www/html/

CMD ["/usr/sbin/httpd", "-D", "FOREGROUND"]

EXPOSE 80
