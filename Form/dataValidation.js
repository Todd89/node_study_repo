const dataVAlidation = (data) => {
	const typeOfFormError = {
		isError: false,
		name: false,
		pass: false,
		email: false,
	}

	if (!data?.name?.length) {
		typeOfFormError.isError = true;
		typeOfFormError.name = true;
	}

	if (!data?.pass?.length) {
		typeOfFormError.isError = true;
		typeOfFormError.pass = true;
	}

	if (!data?.email?.length || !data.email.includes('@')) {
		typeOfFormError.isError = true;
		typeOfFormError.email = true;
	}

	return typeOfFormError;
}

module.exports = dataVAlidation;
