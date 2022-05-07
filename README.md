# eks-paulo

Deploy Docker Containers on Kubernetes on AWS EKS &amp; Fargate: Kubernetes Stateful &amp; Stateless apps using ELB, EBS &amp; EFS

## Installing pulumi

```sh
brew install pulumi node
export PULUMI_CONFIG_PASSPHRASE=""
pulumi login --local
pulumi new aws-typescript
pulumi up
pulumi destroy
pulumi config set aws:region ap-southeast-1
```

## Flux config

```sh
export GITHUB_TOKEN=""
export GITHUB_USER="jgyy"
```
