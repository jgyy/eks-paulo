import CF from './vpc/cf';
import EC2 from './vpc/ec2';

const cf = new CF();
const ec2 = new EC2();

const VPC = ec2.VPC();
cf.VPC = VPC;
const CIDR = cf.CIDR();
ec2.CIDR = CIDR;

ec2.ClusterSharedNodeSecurityGroup();
ec2.ControlPlaneSecurityGroup();
ec2.IngressInterNodeGroupSG();
ec2.InternetGateway();
ec2.SubnetPrivateAPSOUTHEAST1A();
ec2.SubnetPrivateAPSOUTHEAST1B();
ec2.SubnetPrivateAPSOUTHEAST1C();
ec2.SubnetPublicAPSOUTHEAST1A();
ec2.SubnetPublicAPSOUTHEAST1B();
ec2.SubnetPublicAPSOUTHEAST1C();
ec2.NATIP();
ec2.NATGateway();
ec2.PrivateRouteTableAPSOUTHEAST1A();
ec2.PrivateRouteTableAPSOUTHEAST1B();
ec2.PrivateRouteTableAPSOUTHEAST1C();
ec2.NATPrivateSubnetRouteAPSOUTHEAST1A();
ec2.NATPrivateSubnetRouteAPSOUTHEAST1B();
ec2.NATPrivateSubnetRouteAPSOUTHEAST1C();
ec2.VPCGatewayAttachment();
ec2.PublicRouteTable();
ec2.PublicSubnetRoute();
ec2.PublicSubnetIPv6DefaultRoute();
ec2.RouteTableAssociationPrivateAPSOUTHEAST1A();
ec2.RouteTableAssociationPrivateAPSOUTHEAST1B();
ec2.RouteTableAssociationPrivateAPSOUTHEAST1C();
ec2.RouteTableAssociationPublicAPSOUTHEAST1A();
ec2.RouteTableAssociationPublicAPSOUTHEAST1B();
ec2.RouteTableAssociationPublicAPSOUTHEAST1C();
