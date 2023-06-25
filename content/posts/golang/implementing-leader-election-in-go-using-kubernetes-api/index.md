---
title: Implementing Leader Election in Golang using Kubernetes API
date: "2023-06-26"
description: "Istio can reset processing the request. This blog post shows how to analyze the issue if logs does not help"
hero:  hero_implementing-leader-election-in-go-using-kubernetes-api.svg
author:
  name: Marcin Jasion
tags:
- Leader Election
- Golang
- Kubernetes
- Distributed Systems
- Lease Locks
- Kubernetes API
- Leader Election Pattern
- Distributed Computing
- High Availability
- Scalability
- Go Programming
- Kubernetes Coordination
- Concurrency
- Fault Tolerance
- Code Examples
menu:
  sidebar:
    name: Golang Leader Example
    identifier: golang-k8s-leader-example
    parent: golang
    weight: 1
---


## Introduction

Leader election is a crucial pattern in distributed systems where multiple instances or nodes compete
to perform certain tasks. In a Kubernetes cluster, leader election can be used to ensure that only 
one instance is responsible for executing leader-specific tasks at any given time. This blog post will 
explore how to implement a leader election mechanism in Kubernetes using lease locks.

## Overview

The leader election mechanism implemented in   Go code relies on Kubernetes coordination 
features, specifically [Lease](https://kubernetes.io/docs/reference/kubernetes-api/cluster-resources/lease-v1/) 
object in the `coordination.k8s.io` API Group. Lease locks provide a way to acquire a lease on a shared resource, 
which can be used to determine the leader among a group of nodes.

### Repository

The example code, used for this blog is available on [mjasion/golang-k8s-leader-example](https://github.com/mjasion/golang-k8s-leader-example) GitHub repository.

## Code Walkthrough


The main function is the entry point of the program. It reads configuration values from environment 
variables and obtains the Kubernetes `clientset` by getting access to Kube-Api by ServiceAccount attached to Pod.
The application is written to work in Kubernetes Pod, that's why it is using `rest.InClusterConfig()` function.

The leader election configuration is set up using the `LeaderElectionConfig` struct from the Kubernetes 
client library. It specifies the lease lock, lease duration, renewal deadline, retry period, and callback 
functions for leader-specific tasks.

```go
leaderElectionConfig := leaderelection.LeaderElectionConfig{
    Lock: &resourcelock.LeaseLock{
        LeaseMeta: metav1.ObjectMeta{
            Name:      lockName,
            Namespace: leaseNamespace,
        },
        Client: clientset.CoordinationV1(),
        LockConfig: resourcelock.ResourceLockConfig{
            Identity: os.Getenv("HOSTNAME"),
        },
    },
    LeaseDuration: time.Duration(leaseDuration) * time.Second,
    RenewDeadline: time.Duration(renewalDeadline) * time.Second,
    RetryPeriod:   time.Duration(retryPeriod) * time.Second,
    Callbacks: leaderelection.LeaderCallbacks{
        OnStartedLeading: onStartedLeading,
        OnStoppedLeading: onStoppedLeading,
    },
    ReleaseOnCancel: true,
}
```

The most important settings are the **lease duration**, **renewal deadline**, and **retry period**:
* The `LeaseDuration` specifies how long the lease is valid. 
* The `RenewDeadline` specifies the amount 
  of time that the current node has to renew the lease before it expires. 
* The `RetryPeriod` specifies the amount of time  that the current holder of a lease has last updated the lease.

The leader-specific tasks are performed in the `onStartedLeading` function, which is called 
when the current node becomes the leader. The `updateServiceSelectorToCurrentPod` function updates the 
service selector to include the current pod's hostname.
```go
func onStartedLeading(ctx context.Context) {
	log.Println("Became leader: ", os.Getenv("HOSTNAME"))
	clientset := getKubeClient()
	updateServiceSelectorToCurrentPod(clientset)
	go func() {
		for {
			select {
			case <-ctx.Done():
				log.Println("Stopped leader loop")
				return
			default:
				log.Println("Performing leader tasks...")
				time.Sleep(1 * time.Second)
			}
		}
	}()
}
```

The `onStoppedLeading` function is called when the current node stops being the leader. It can be used for cleanup tasks.

```go
func onStoppedLeading() {
	log.Println("Stopped being leader")
}
```

A context and a wait group are created to manage goroutines. A goroutine is started to run the leader
election using the `leaderelection.RunOrDie` function.

```go
ctx, cancel := context.WithCancel(context.Background())
defer cancel()
wg := &sync.WaitGroup{}
wg.Add(1)

go func() {
    defer wg.Done()
	leaderelection.RunOrDie(ctx, leaderElectionConfig)
}()

cancel()
wg.Wait()
```

The program also sets up a Gin router and defines a root endpoint that returns the hostname of the
current node, to easily check which Pod is beeing a leader.


## Demo 1 - Deploying a single Pod

In this demo, we will deploy a single Pod to a Kubernetes cluster and observe how the leader election works.

{{< video src="1_log_and_lease.webm" type="video/webm" preload="auto" loop="true" autoplay="true" >}}

As you can see here, the pod is elected as a leader and performs leader-specific tasks. The `lease` object
contains the information about the current leader in the `HOLDER` column.

```bash
NAME                 HOLDER                               AGE
k8s-leader-example   k8s-leader-example-8dd646bb7-dsfmq   11s
```

## Demo 2 - Deploying multiple Pods and killing the leader

In this demo, we will deploy multiple Pods to a Kubernetes cluster and observe how the leader election works.
The settings used for this demo are as follows:
|Setting|Value|
|-|-|
|Lease Duration|10 seconds|
|Renewal Deadline|5 seconds|
|Retry Period|1 seconds|

The leader election mechanism will attempt to renew the lease every 5 seconds. If the lease is not renewed
within 5 seconds, the leader election mechanism will attempt to acquire the lease. If the lease is not acquired
within 1 second, the leader election mechanism will retry to acquire the lease.

<!-- ![2_multi_instance.webm](2_multi_instance-min.webm) -->
{{< video src="2_multi_instance-min.webm" type="video/webm" preload="auto" loop="true" autoplay="true" >}}

Running command `kubectl get lease --watch` allows to observe the leader election process. The `lease` object
contains first the information about the previous leader, when the leader is killed, and then the information
about the new leader.



## Conclusion

Implementing leader election in Kubernetes using lease locks is an effective way to ensure that only 
one instance or node performs leader-specific tasks at a time. In this blog post, we explored the provided 
Go code that demonstrates how to implement leader election in a Kubernetes cluster. 

By incorporating leader election into your distributed system, you can enhance its reliability and prevent 
conflicts that may arise from multiple instances attempting to execute the same tasks simultaneously.
