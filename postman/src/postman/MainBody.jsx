import React from 'react';
import { useState, useEffect } from 'react';

import RequestSettings from './RequestSettings/RequestSettings';
import SavedRequests from './SavedRequests/SavedRequests';

import './main-body.css';

const MainBody = () => {
const [savingData, setSavingData] = useState({
	method: "GET",
	url: "",
	params: [],
	headers: [],
	body: '',
});
const [savedRequests, setSavedRequests] = useState([]);
const [responseInfoData, setResponseInfoData] = useState({});

  return (
	<div className='main-body'>
		<SavedRequests
			savedRequests={savedRequests}
			setSavedRequests={setSavedRequests}
			setSavingData={setSavingData}
		/>
		<RequestSettings
			savingData={savingData}
			responseInfoData={responseInfoData}
			setSavingData={setSavingData}
			setSavedRequests={setSavedRequests}
			setResponseInfoData={setResponseInfoData}
		/>
	</div>
  )
}


export default MainBody;
