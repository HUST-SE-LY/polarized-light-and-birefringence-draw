echarts.registerTransform(ecStat.transform.regression);
const inputList=document.querySelectorAll(".data_input");
const leftInput=document.querySelectorAll(".ILeft");
const rightInput=document.querySelectorAll(".IRight");
const button=document.querySelector(".button");
const buttonI=document.querySelector(".cos-IButton");
const chart=echarts.init(document.querySelector(".chart"));
const chart2=echarts.init(document.querySelector(".chart2"));
const chart3=echarts.init(document.querySelector(".chart3"));
const chartI=echarts.init(document.querySelector(".chartI"));
const chartR=echarts.init(document.querySelector(".chartR"));
const cosList=document.querySelectorAll(".cos");
let A=null;
const degree=['0','10','20','30','40','50','60','70','80','90','100','110','120','130','140','150','160','170','180','190','200','210','220','230','240','250','260','270','280','290','300','310','320','330','340','350'];

//判断数据是否填满
let Imax;
button.onclick=()=>{
  let fullData=true;
  let data=[];
  let data2=[];
  for(let i = 0; i <= 360;i += 10) {
    if(i===360||inputList[i/10].value) {
      i===360?data.push([parseFloat(inputList[0].value),360]):data.push([parseFloat(inputList[i/10].value),i]);
    } else {
      fullData=false;
      break;
    }
  }
  if(fullData) {
    for(let i = 0;i<inputList.length;i++) {
      if(i===0) {
        Imax=parseFloat(inputList[i].value);
      } else {
        if(parseFloat(inputList[i].value)>Imax) {
          Imax=parseFloat(inputList[i].value);
        }
      }
    }
    console.log(Imax)

    chart.setOption({
      title: {
        text: '椭圆偏振光通过偏检器后的光强分布'
      },
      legend: {
        data: ['I'],
        left: 'right'
      },
      tooltip:{},
      polar: {},
      angleAxis: {
        type: 'value',
        startAngle: 50,
        min: 0,
        max: 360,
      },
      radiusAxis: {

      },
      series: [
        {
          name: 'I',
          type: 'line',
          smooth:false,
          coordinateSystem: 'polar',
          data: data,
          symbolSize:5,
        }
      ]
    })

  } else {
    alert("数据不足！")
  }
  if(!A) {
    alert("缺少A值，请先绘制cos²-I图像!")
  } else {
    for(let i = 0 ;i<=36;i++) {
      data2.push([A*(0.75*Math.cos(2*Math.PI*i*10/360)*Math.cos(2*Math.PI*i*10/360)+0.25*Math.sin(2*Math.PI*i*10/360)*Math.sin(2*Math.PI*i*10/360)),i*10])
    }
    console.log(data2)
    chart2.setOption({
      title:{
        text:"椭圆偏振光通过偏检器后的光强分布理论值"
      },
      legend: {
        data: [{
          name:'I',
          lineStyle:'solid',
        },{
          name:'I(理论)',
          lineStyle: 'dashed'
        }],
        left: 'right',
      },
      tooltip:{},
      polar: {},
      angleAxis: {
        type: 'value',
        startAngle: 50,
        min: 0,
        max: 360,
      },
      radiusAxis: {

      },
      series: [
        {
          name: 'I',
          type: 'line',
          smooth:false,
          coordinateSystem: 'polar',
          data: data2,
          symbolSize:5,
        }
      ]
    })
  }
  if(A&&fullData) {
    chart3.setOption({
      title:{
        text:"椭圆偏振光通过偏检器后的光强分布"
      },
      legend: {
        data: ['I','I(理论)'],
        left: 'right'
      },
      tooltip:{},
      polar: {},
      angleAxis: {
        type: 'value',
        startAngle: 50,
        min: 0,
        max: 360,
      },
      radiusAxis: {

      },
      series: [
        {
          name: 'I(理论)',
          type: 'line',
          smooth:false,
          lineStyle:'dashed',
          coordinateSystem: 'polar',
          data: data2,
          symbol:'circle',
          symbolSize:5,
        },
        {
          name: 'I',
          type: 'line',
          smooth:false,
          coordinateSystem: 'polar',
          data: data,
          symbolSize:5,
        }
      ]
    })

  }
}
buttonI.onclick=()=>{
  let dataLeft=[];
  let dataRight=[];
  console.log(leftInput)
  for(let i = 0;i< leftInput.length;i++) {
   dataLeft.push([parseFloat(cosList[i].innerHTML),parseFloat(leftInput[i].value)]);
   dataRight.push([parseFloat(cosList[i].innerHTML),parseFloat(rightInput[i].value)]);
  }
  let myRegressionL = ecStat.regression('linear', dataLeft);
  let myRegressionR = ecStat.regression('linear', dataRight);

  console.log(myRegressionR.expression);
  console.log(myRegressionL.expression);

  A=(parseFloat(myRegressionR.expression.split(" ")[2].split("x")[0])+parseFloat(myRegressionL.expression.split(" ")[2].split("x")[0]))/2;
  console.log(`A=${A}`)

  chartI.setOption({
    title:{
      text:'cos²θ与I(左旋)的关系'
    },
    dataset: [
      {
        source: dataLeft
      },
      {
        transform: {
          type: 'ecStat:regression'
          // 'linear' by default.
          // config: { method: 'linear', formulaOn: 'end'}
        }
      },
    ],
    xAxis:{

    },
    yAxis:{
    },
    series:[
      {
        name:"I(左旋)",
        type:"scatter",
      },
      {
        name:'line',
        type:'line',
        datasetIndex: 1,
        symbolSize: 0.1,
        symbol: 'circle',
        label: { show: true, fontSize: 16 },
        labelLayout: { dx: -20 },
        encode: { label: 2, tooltip: 1 }
      },
    ]

  });
  chartR.setOption({
    title:{
      text:'cos²θ与I(右旋)的关系'
    },
    dataset: [
      {
        source: dataRight
      },
      {
        transform: {
          type: 'ecStat:regression'
          // 'linear' by default.
          // config: { method: 'linear', formulaOn: 'end'}
        }
      },
    ],
    xAxis:{

    },
    yAxis:{
    },
    series:[
      {
        name:"I(右旋)",
        type:"scatter",
      },
      {
        name:'line',
        type:'line',
        datasetIndex: 1,
        symbolSize: 0.1,
        symbol: 'circle',
        label: { show: true, fontSize: 16 },
        labelLayout: { dx: -20 },
        encode: { label: 2, tooltip: 1 }
      },
    ]

  })
}