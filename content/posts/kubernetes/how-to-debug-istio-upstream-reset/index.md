---
title: How to debug Istio Upstream Reset 502 UPE (old 503 UC)
date: "2022-04-25"
description: "Istio can reset processing the request. This blog post shows how to analyze the issue if logs does not help"
hero:  service_mesh.png
author:
  name: Marcin Jasion
draft: true
tags:
- istio
- 502 UPE
- kubernetes
- tcpdump
- upe
- 503 UC
- upstream_reset_before_response_started 
- Upstream connection termination
- wireshark
menu:
  sidebar:
    name: Istio
    identifier: istio
    parent: kubernetes
    weight: 1
---
