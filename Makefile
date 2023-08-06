
npm/install:
	npm ci

lint/application:
	npm run lint

test/application:
	npm run test

bundle/application:
	npm run build

zip/lambda:
	zip -j ./dist/bundle.zip ./dist/index.js

aws/lambda/update/actions:
	@zip_file_path="${GITHUB_WORKSPACE}/dist/bundle.zip"; \
	aws lambda update-function-code \
		--region eu-west-2 \
		--function-name easy-form-email-handler \
		--zip-file "fileb://$${zip_file_path}"

aws/lambda/update/local:
	@zip_file_path="./dist/bundle.zip"; \
	aws lambda update-function-code \
		--region eu-west-2 \
		--function-name easy-form-email-handler \
		--zip-file "fileb://$${zip_file_path}"

