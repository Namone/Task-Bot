import { Application } from 'probot'; // eslint-disable-line no-unused-vars
import * as SlackAPI from './slack';

export = (app: Application) => {
  app.on('pull_request.opened', async (context) => {
    const pattern = /\b[a-zA-Z]{3}\-{1}\d{3}\b|\b\d{6}\b/g;
    const { number, title, body, head: { repo: { name }}, base: { user: { login }}, ...remaining } = context.payload.pull_request;
    
    const isMatch = title.match(pattern);
    if (!isMatch)
      return await app.log("No task ID found. Supplied title data: " + title);

    let bodyOutput = "";
    isMatch.forEach((taskId: String, index: any) => {
      const link = taskId.match(/\b[a-zA-Z]{3}\b/g) ? "https://bluetent.atlassian.net/browse/" : "https://system.na2.netsuite.com/app/accounting/project/projecttask.nl?id=";
      let displayIndex = index + 1;
      const taskCount = isMatch.length > 1 ? " (" + displayIndex + "/" + isMatch.length + ")" : "";
      bodyOutput += "[This pull request relates to this task." + taskCount + "](" + link + taskId.toUpperCase() + ")";

      if (taskCount.length > 0 && displayIndex < isMatch.length) {
        bodyOutput += "\n \n";
      }
    });

    if (body.length > 0) {
      bodyOutput += "\n \n";
    }

    // Post a comment for the PR body
    await context.github.pullRequests.update({
      repo: name,
      owner: login,
      number: number,
      body: bodyOutput + body,
    });
  });

  app.on('pull_request.opened', async (context) => {
    const { number, title, body, head: { repo: { name }}, base: { user: { login }}, ...remaining } = context.payload.pull_request;


  });

  app.on('pull_request.ready_for_review', async (context) => {
    // @TODO: add slack message to alert users a review is needed...
  });

  app.on('pull_request.closed', async (context) => {

    const { number, title, merged, head: {label, user: {login} }, ...remaining } = context.payload.pull_request;
    // `res` contains information about the posted message

    SlackAPI.postMessage({});
    
    if(!merged) {
      return;
    }
  });

  
}
