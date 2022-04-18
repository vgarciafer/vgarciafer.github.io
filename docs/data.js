 async function getData() {	
		const url = 'https://data.cdc.gov/resource/9mfq-cb36.json?state=AL';
		const response = await fetch(url);
		const data = await response.json(); // read response body and parse as JSON
		alert(data[0].submission_date);
      }
	 export rccdata =await getData();
