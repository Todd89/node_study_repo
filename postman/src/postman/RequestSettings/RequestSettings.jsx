import React from 'react';

import RequestMainSettings from './RequestMainSettings/RequestMainSetting';
import RequestParams from './RequestParams/RequestParams';
import RequestHeaders from './RequestHeaders/RequestHeaders';
import RequestActions from './RequestActions/RequestActions';
import ResponseInfo from './ResponseInfo/ResponseInfo';

const RequestSettings = ({
	savingData,
	responseInfoData,
	setSavingData,
	setSavedRequests,
	setResponseInfoData
}) => {
	return (
		<div className='request-settings'>
			<RequestMainSettings setSavingData={setSavingData} savingData={savingData}/>
			<RequestParams setSavingData={setSavingData} />
			<RequestHeaders setSavingData={setSavingData} />
			<RequestActions
				savingData={savingData}
				setSavedRequests={setSavedRequests}
				setResponseInfoData={setResponseInfoData}
			/>
			<ResponseInfo responseInfoData={responseInfoData}/>
		</div>
	)
}

export default RequestSettings;
