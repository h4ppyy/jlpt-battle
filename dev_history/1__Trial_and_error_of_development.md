
## 개발 시행착오

#### 이슈 #1
```
개발환경은 항상 ubuntu16.04 가상환경에서 세팅하였으나
react.js + express.js의 개발환경 세팅을 가상환경에 하니깐 아래와 같은 문제가 발생하였다

- react-scripts 의 자동 리로딩 불가
- nodemon 의 자동 리로딩 불가

소스가 변경되면 자동으로 서버가 재기동되면서 반영된 결과를 출력해야되나
ubuntu16.04 가상환경과 local 환경의 싱크 간에 이벤트 리슨을 못하는 현상이 있었다
```

#### 해결 #1
```
local에 개발환경을 구성하여 개발함
결과적으로 개발 생산성이 눈에 보이도록 증가함
```

---------

#### 이슈 #2
```
초기에 express-generator를 이용해서 백엔드를 구축하였으나 socket.io 연동에 어려움을 겪음
express-generator를 포기하고 app.js 파일 하나로 구성된 샘플 소스를 이용하여 하나하나 확장하여 프로젝트를 구성함
```

#### 해결 #2
```
express-generator로 구성되는 전체적인 프로젝트 구성을 모른다면
바닥부터 구현하는 것도 좋은 방안으로 보여짐
```

---------

#### 이슈 #3
```
Header 컴포넌트와 Fotter 컴포넌트를 공통으로 사용하기 위해 Router 안에 넣어놨으나

this.props.history.push('/login');

위 코드를 실행하려니 오류가 발생함
알고보니 history.push() 를 사용하기 위해서는 Route 안에 있어야 사용이 가능했기에
Header 컴포넌트와 Footer 컴포넌트를 Route 안에 구성함
```

#### 해결 #3
```
변경전 -> <Header/>
변경후 -> <Route component={Header} />

변경전 -> <Footer/>
변경후 -> <Route component={Footer} />

this.props 에 대한 정확한 이해가 필요했음
앞으로 더 공부할 예정
```

---------

#### 이슈 #4
```
react-redux 연동
action / reduce / store 에 대한 구성이 정확히 이해가 되지 않았음
특히나 mapStateToProps, mapDispatchToProps 는 한번 정확히 다시 공부해야할 것 같음
```

#### 해결 #4
```
sample/TestRedux1.js
sample/TestRedux2.js
sample/TestReduxClass1.js
sample/TestReduxClass2.js
store/counter.js
reducers/counter.js
action/decrement.js
action/increment.js

여러 샘플을 참조하여 적당히 샘플을 구성한 후 도입
```

---------

#### 이슈 #5
```
componentDidMount 함수에 setState 함수를 사용하면 안된다는 이야기

componentDidMount = () => {
	this.setState({hello: 'world'});
}

componentDidMount 라이프 사이클 상 렌더 이후에 실행되기 때문에
두번 렌더되는 자원낭비 현상이 일어남
```

#### 해결 #5
```
...
```

---------
<!--stackedit_data:
eyJoaXN0b3J5IjpbMjQ4NjM1MzA0LDE1NTA1MTM2MjJdfQ==
-->