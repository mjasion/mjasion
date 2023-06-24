---
title: Implementing Leader Election in Golang using Kubernetes API
date: "2023-06-23"
description: "Istio can reset processing the request. This blog post shows how to analyze the issue if logs does not help"
hero:  service_mesh.png
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
    name: Golang
    identifier: golang
    weight: 1
---


## Introduction

Leader election is a crucial pattern in distributed systems where multiple instances or nodes compete
to perform certain tasks. In a Kubernetes cluster, leader election can be used to ensure that only 
one instance is responsible for executing leader-specific tasks at any given time. This blog post will 
explore how to implement a leader election mechanism in Kubernetes using lease locks.

## Overview

The leader election mechanism implemented in the provided Go code relies on Kubernetes coordination 
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

A context and a wait group are created to manage goroutines. A goroutine is started to run the leader 
election using the `leaderelection.RunOrDie` function.

```go
ctx, cancel := context.WithCancel(context.Background())
defer cancel()
wg := &sync.WaitGroup{}
wg.Add(1)

go func() {
    defer wg.Done()

    // Start the leader election
    leaderelection.RunOrDie(ctx, leaderElectionConfig)
}()

cancel()
wg.Wait()
```

The program also sets up a Gin router and defines a root endpoint that returns the hostname of the 
current node, to easily check which Pod is beeing a leader.

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
				// Perform leader tasks here
				log.Println("Performing leader tasks...")
				time.Sleep(1 * time.Second)
			}
		}
	}()
}
```
The`onStoppedLeading` function is called when the current node stops being the leader.
```go
func onStoppedLeading() {
	log.Println("Stopped being leader")
}
```
## Conclusion

Implementing leader election in Kubernetes using lease locks is an effective way to ensure that only 
one instance or node performs leader-specific tasks at a time. In this blog post, we explored the provided 
Go code that demonstrates how to implement leader election in a Kubernetes cluster. The code utilized the 
Kubernetes client library and lease locks to elect a leader and perform leader-specific tasks.

By incorporating leader election into your distributed system, you can enhance its reliability and prevent 
conflicts that may arise from multiple instances attempting to execute the same tasks simultaneously.
