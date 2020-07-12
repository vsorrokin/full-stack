ARG NODE_IMAGE

FROM ${NODE_IMAGE}

RUN echo $NODE_IMAGE

# COPY ./ /usr/src/app/
#
# RUN ls /usr/src/app/


# mkcert deps
# RUN apt update
# RUN apt install -y libnss3-tools
#
# # homebrew install
# RUN useradd -m -s /bin/bash linuxbrew
# USER linuxbrew
# RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
#
# # mkcert install
# RUN brew install mkcert


# RUN apt-get update \
# 	&& apt-get install -y --no-install-recommends ca-certificates curl file g++ git locales make uuid-runtime \
# 	&& apt-get clean \
# 	&& rm -rf /var/lib/apt/lists/* \
# 	&& sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen \
# 	&& dpkg-reconfigure locales \
# 	&& update-locale LANG=en_US.UTF-8 \
# 	&& useradd -m -s /bin/bash linuxbrew \
# 	&& echo 'linuxbrew ALL=(ALL) NOPASSWD:ALL' >>/etc/sudoers
#
# USER linuxbrew
# WORKDIR /home/linuxbrew
# ENV LANG=en_US.UTF-8 \
# 	PATH=/home/linuxbrew/.linuxbrew/bin:/home/linuxbrew/.linuxbrew/sbin:$PATH \
# 	SHELL=/bin/bash
#
# RUN git clone https://github.com/Homebrew/brew /home/linuxbrew/.linuxbrew/Homebrew \
# 	&& mkdir /home/linuxbrew/.linuxbrew/bin \
# 	&& ln -s ../Homebrew/bin/brew /home/linuxbrew/.linuxbrew/bin/ \
# 	&& brew config
