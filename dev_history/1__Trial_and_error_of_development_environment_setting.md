
## 개발환경 세팅의 시행착오

#### 이슈 #1
```
개발환경은 항상 ubuntu16.04 가상환경에서 세팅하였으나
react.js + express.js의 개발환경 세팅을 가상환경에 하니깐 아래와 같은 문제가 발생하였다

- react-scripts 의 자동 리로딩 불가
- nodemon 의 자동 리로딩 불가

소스가 변경되면 자동으로 서버가 재기동되면서 반영된 결과를 출력해야되나
ubuntu16.04 가상환경과 local 환경의 싱크 간에 이벤트 리슨을 못하는 현상이 있었다
```

#### 해결 #1
```
local에 개발환경을 구성하여 개발함
결과적으로 개발 생산성이 눈에 보이도록 증가함
```


```
ubuntu16.04
```
### 1.  install ubuntu16.04
Download required  
```
virtualbox
vagrant
```
```
$ mkdir workspace
$ cd ubuntu
```
`vi Vagrantfile`
```ruby
# -*- mode: ruby -*-
# vi: set ft=ruby :

MEMORY = 4096
CPU_COUNT = 2

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/xenial64"

  config.vm.network "private_network", ip: "192.168.33.50"
  # config.vm.network "forwarded_port", guest: 3306, host: 3306

  config.vm.synced_folder  ".", "/vagrant", disabled: false
  config.vm.synced_folder  "./project", "/home/vagrant/project", disabled: false

  config.vm.provider "virtualbox" do |vb|
      vb.customize ["modifyvm", :id, "--memory", MEMORY.to_s]
      vb.customize ["modifyvm", :id, "--cpus", CPU_COUNT.to_s]
  end
end
```
```bash
$ vagrant up
$ vagrant ssh
```

### 2.  install node.js LTS (base 2019.08.28)
```bash
$ cd ~
$ curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
$ sudo bash nodesource_setup.sh
$ sudo apt-get install nodejs
```

### 2.1 check node.js and npm

```bash
$ nodejs -v
v10.16.3

$ npm -v
6.9.0
```

### 3. install yarn (base 2019.08.28)
```bash
$ curl -o- -L https://yarnpkg.com/install.sh | bash
```

### 3.1 check yarn
```bash
$ yarn -v
1.17.3
```

### 4. Configuring a project

```bash
$ mkdir project
$ cd project
```
```bash
$ git clone https://github.com/h4ppyy/jlpt-battle
$ cd jlpt-battle
$ yarn create react-app app_frontend
$ yarn global add express-generator
$ express --no-view app_backend
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbNDg0OTE2Mjk1XX0=
-->