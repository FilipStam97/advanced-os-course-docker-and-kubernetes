# advanced-os-course-docker-and-kubernetes





## Kubernetes

### Check context
kubectl config current-context
kubectl config get-contexts
kubectl config use-context docker-desktop

### Get nodes 
kubectl get nodes //returns nodes

### Apply config to the cluster
kubectl apply -f k8s/all.yaml
kubectl get pods
kubectl get svc


### Restarting  a pod/service and updating 
docker build -t service2-dev:v2 -f service2/Dockerfile service2
kubectl set image deployment/service2 service2=service2-dev:v2
kubectl rollout restart deployment/service2
kubectl rollout status deployment/service2

kubectl describe pod -l app=service2 | findstr "Image:"


### Logs
kubectl logs -l app=service2 --tail=200



## Demonstrating function - Management

### Restart a pod
kubectl delete pod -l app=service1
kubectl get pods

### Scale manually
kubectl scale deployment service1 --replicas=2
kubectl get pods


## Demonstrating function - Orchestration

### Show services
kubectl get svc

### Show logs
kubectl logs deploy/service2

## Demonstrating function - Scaling & autoscaling

### Add metrics server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

kubectl get pods -n kube-system -l k8s-app=metrics-server

kubectl patch deployment metrics-server -n kube-system --type='json' -p='[{"op": "add", "path": "/spec/template/spec/containers/0/args/-", "value": "--kubelet-insecure-tls"}]'  -----> needs permision for dev mode


kubectl top nodes
kubectl top pods --all-namespaces


## For Horizontal Pod Autoscaler  
kubectl get hpa

## Generate load
run the load_test.py then

kubectl get hpa
kubectl get pods

