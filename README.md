# viewMON

маленькие сервис мониторинга 

## Установка

прежде всего установите веб-сервер с `nginx` и поставить необходимый модуль python `websockets`

```shell
pip install websockets
```

клонируем репозиторий

```shell
git clone https://github.com/birdiecode/viewMON.git
cd viewMON
```

создание директорий

```shell
mkdir {/etc/viewmon,/var/run/viewmon,/var/www/viewmon}
```

создание группы и пользователя

```shell
groupadd viewmon
useradd -d /dev/null -s /usr/sbin/nologin -g viewmon viewmon
```

назначаем права на директории

```shell
chown root:viewmon /etc/viewmon
chmod u=rwx,go=rx /etc/viewmon

chown viewmon. /var/run/viewmon
chmod ug=rwx,o=rx /var/run/viewmon

chown $USER:www-data /var/www/viewmon
chmod u=rwx,go=rx /var/www/viewmon
```

перенос файлы по своим местам

```shell
mv ./example_grid.cfg /etc/viewmon/grid.cfg
chown root:viewmon /etc/viewmon/grid.cfg
chmod u=rw,go=r /etc/viewmon/grid.cfg

mv ./main.py /usr/bin/viewmond
chown root. /usr/bin/viewmond
chmod u=rwx,go=rx /usr/bin/viewmond


mv {index.html,main.js,style.css,widgets-manager.js} /var/www/viewmon/ 
chown -hR $USER:www-data /var/www/viewmon
chmod -R u=rwx,go=rx /var/www/viewmon

mv ./viewmon.service /usr/lib/systemd/system/viewmon.service
chown root. /usr/lib/systemd/system/viewmon.service
chmod u=rw,go=r /usr/lib/systemd/system/viewmon.service
```

запуск сервиса viewmon

```shell
systemctl start viewmon
systemctl enable viewmon
```

настроем nginx. Варианта настойки два, либо переместить файл `nginx.conf` в `/etc/nginx/sites-available/` с переименование в `viewmon`, а затем сделать ссылку `viewmon` в папке `/etc/nginx/sites-enabled/` на `../sites-available/viewmon`

```shell
mv ./nginx.conf /etc/nginx/sites-available/viewmon
pushd /etc/nginx/sites-enabled/
ln -s ../sites-available/viewmon ./viewmon
rm ./default # возможно его надо удалить чтобы не было конфликта
popd
systemctl restart nginx
```

или вставить блок сервер из `./nginx.conf` в файл `/etc/nginx/nginx.conf`.

теперь осталось лишь добавить коллекторы которые будут собирать данные, форматировать и записовать в файл в каталоге`/var/run/viewmon`

приведу пример с коллектором ping :

откроем `crontab` пользователя viewmon

```shell
crontab -u viewmon -e
```

и добавляем 

```
* * * * * bash /etc/viewmon/collector_ping.sh
```
а затем скопируем пример колектора `ping` из директории `example_collector` в директорию `/etc/viewmon/` 

```shell
mv ./example_collector/collector_ping.sh /etc/viewmon/collector_ping.sh
```
