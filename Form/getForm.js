const errorBorderStyle = 'border: 2px solid red';

const getForm = (typeOfFormError = {}, name='', pass='', email='') => {
	const nameStyle = `${typeOfFormError?.name ? errorBorderStyle : ''}`;
	const nameValue = `${name ? 'value=' + name : 'placeholder="name"'}`
	const passStyle = `${typeOfFormError?.pass ? errorBorderStyle : ''}`;
	const passValue = `${pass ? 'value=' + pass : 'placeholder="pass"'}`
	const emailStyle = `${typeOfFormError?.email ? errorBorderStyle : ''}`;
	const emailValue = `${email ? 'value=' + email : 'placeholder="email"'}`

	return `<body style="height: 100vh; background-color: #a7f2bb; display: flex; justify-content: center; align-items: center;">
	<div style="display: flex; flex-direction: column; width: 100px;">
		<form method="get" action="" novalidate>
			<input type="type" style="margin-bottom: 10px;${nameStyle}" ${nameValue} name="name">
			<input type="text" style="margin-bottom: 10px;${passStyle}" ${passValue} name="pass">
			<input type="email" style="margin-bottom: 10px;${emailStyle}" ${emailValue} name="email">
			<button type="submit">Submit</button>
		</form>
	</div>
</body>`
}

module.exports = getForm;
