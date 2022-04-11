---
title: Kind - Kubernetes IN Docker
weight: 1
date: "2022-04-21T18:00:00.000Z"
menu:
  notes:
    name: kind
    identifier: k8s-kind
    parent: k8s
    weight: 2
---

<!-- Variable -->
{{< note title="Kind - mount resolv.conf to skip systemd-resolved" >}}

By default Kind uses system `/etc/resolv.conf`. This points to `systemd-resolved`  service and some queries might fail. You can mount your network DNS configuration.

Save below config in `kind-cluster.yaml`: 
{{<highlight yaml "lineNos=yes">}}
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  extraMounts:
  - hostPath: /run/systemd/resolve/resolv.conf
    containerPath: /etc/resolv.conf
{{</highlight>}}

and run the `kind`:
{{<highlight bash "lineNos=false">}}
$ kind create cluster --config kind-cluster.yaml
{{</highlight>}}

Control-plane node should use your network DNS now.