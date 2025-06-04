#!/bin/bash

TIME="1"
TELEGRAM_BOT_TOKEN="5635936568:AAEw_Dde-aue7Q-3OKXRVyolseALK9OBCU4"
TELEGRAM_USER_ID="-4616142972"


URL="https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage"

if [ "$CI_JOB_STATUS" == "failed" ]; then
    STATUS_EMOJI="⚠️"
else
    STATUS_EMOJI="✅"
fi

if [ "$CI_JOB_STAGE" == "build" ]; then
    DEPLOY_MESSAGE="⏳ The deployment and restart wait time for the project is 15 seconds. You can change it in the 'deploy.sh' file by modifying the 'sleep' value."
elif [ -f "../deploy_message.txt" ]; then
    DEPLOY_MESSAGE=$(cat ../deploy_message.txt)
else
    DEPLOY_MESSAGE="No deployment message received."
fi

TEXT="%0A%0AStatus: $STATUS_EMOJI $CI_JOB_STATUS%0A%0AProject: $CI_PROJECT_NAME%0AURL: $CI_PROJECT_URL/pipelines/$CI_PIPELINE_ID/%0ABranch: $CI_COMMIT_REF_SLUG%0AStage: $CI_JOB_STAGE/%0ADeveloper: $GITLAB_USER_NAME %0A%0A➡️ Deployment Message:%0A$DEPLOY_MESSAGE"

curl -s --max-time $TIME -d "chat_id=$TELEGRAM_USER_ID&disable_web_page_preview=1&text=$TEXT" $URL > /dev/null
