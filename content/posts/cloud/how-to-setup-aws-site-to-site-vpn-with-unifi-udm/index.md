---
title: How to setup AWS Site-to-Site VPN with Unifi UDM 
date: "2022-06-28"
description: "Site-to-Site VPN allows to connect local network with AWS VPC. This blogs is an instruction step by step to establish connection"
hero:  
author:
  name: Marcin Jasion
tags:
- cloud
- aws
- unifi
- udm
- how to
menu:
  sidebar:
    name: VPN
    identifier: vpn
    parent: Cloud
    weight: 1
---

By default resources you launch on cloud (EC2, RDS and others) cannot communicate with your local network like home or office. To allow this you can create Site-to-Site VPN. This VPN connection will be established between your router and AWS VPC.

Creating VPN between networks is [well documented](https://docs.aws.amazon.com/vpn/latest/s2svpn/SetUpVPNConnections.html). However you can have issues configuring your home router. At home I have Unifi Dream Machine router, which is designed for small networks, but have features which are matching advanced routers for offices. One of them is Site-to-Site VPN using IPSec protocol.

## Setup VPN on AWS

First step is to create a VPN connection on AWS. For this blog I will use... the default VPC 🙂. To configure it AWS requires to define 3 components: Customer Gateway, Virtual Private Gateway and VPN connnection

The Customer Gateway is basically just an entity that holds the information about your home router - public IP.
The Virtual Private Gateway is the virtual entity on the VPC side, that allows to configure routing to that gateway. That VPG will is attached to the VPN. So the last entity is VPN connection which brings it all together and establishes the VPN tunnels between your home or office and VPC.

### Create base components

To start your VPN connection start from defining Customer Gateway.  
Go to **VPC** tab, find panel **Customer Gateway** and click button to **Create**. Required field is IP address. Write here your public IP address where your router is running. Also it is good to name this gateway. I named my as `home`.

> To quickly check you public IP you can open  https://ifconfig.co 

<!-- {{< img src="virtual_gateway_notassigned.png" width="800" float="right" title="A boat at the sea" >}} -->

Next step is to create Virtual Private Gateway. Go to the **Virtual Panel Gateway** panel and click **Create**. It just asks for a name. Let's name it also `home`. The VPG state will be detached. I will back to it later.
![](virtual_gateway_notassigned.png)


### Create VPN connection

This is a time to start defining VPN.  Open **Site-to-Site VPN connection** panel and click **Create VPN Connection**. The form wil have 3 panels: details and tunnels options.

**Details** starts from defining the gateway on VPC side. Choose **Virtual private gateway** and in form select your VPG.

Next select **Customer gateway**. Here you define with which router the VPN will be established.

There is last configuration to set: routing. It is a section where user defines to which local networks will the VPN will be used. On the screen I marked this as a point **1**.

AWS allows for two options. to configure routing dynamic, based on BGP. And statically defined. In my case I am using static.   
In the prefixes I am putting my local network prefixes(like `192.168.1.0/24`). You are allowed to put multiple networks here.

![](create_vpn.png)

### Configure Tunnel Options

Tunnel options are allowing to define IPSec parameters. AWS creating a VPC creates 2 tunnels, to which you can connect and each of them you can configure differently. Or same 🙂.

What I am always choosing is:
* **Encryption algorithms**: AES-256 (for both phases)
* **Integrity algorithms**: SHA2-256, SHA2-384, SHA2-512
* **DH groups**: all above 14
* **IKE Version**: ikev2

Those parameters will be crucial for setting up our Unifi router.

When you finish this changes you can create VPN and wait few minutes. The VPN connection should be ready.
![](vpn_ready.png)

### Configure VPC Routing

Previously I mentioned that Virtual Private Gateway state is not attached to any VPC. We can reassign the VPN connection between VPC`s by chaning attachement. 

To attach go back to **Virtual Private Gateway** and select your VPG and in **Actions** button find **Attach to VPC**. Select your VPC and your VPG should be available to configure routing on VPC.
![](virtual_gateway_assigned.png.png)

