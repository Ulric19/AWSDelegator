grlsInstanceSchema = new mongoose.Schema({
	timeBudgetName: String,
	instanceId: String,
	instanceType: String,
	user: String,
	group: String,
	instanceRegion: String,
	serviceType: String,
	//ec2 t2 instance type
	instanceType: String,
	//rds min,max allowed connections
	minConnectionsLimit: Number,
	maxConnectionsLimit: Number,
	lifetime: Number,
	//under profile decay coefficient
	udecay: Number,
	//over profile decay coefficient
	odecay: Number,
	state: String
});

mongoose.model('grlsInstances', grlsInstanceSchema, 'grlsInstances');