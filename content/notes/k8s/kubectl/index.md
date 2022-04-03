---
title: Merging multipe Kubernetes configs
weight: 1
date: "2022-04-01T1:00:00.000Z"
menu:
  notes:
    name: kubectl
    identifier: k8s-kubectl
    parent: k8s
    weight: 1
---

<!-- Variable -->
{{< note title="Merging multipe Kubernetes configs" >}}

```bash
KUBECONFIG=$(ls ~/.kube/*.config | tr "\n" ":") kubectl config view --merge --flatten > ~/.kube/config
```