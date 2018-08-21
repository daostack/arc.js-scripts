export class Common {

  public static sleep(milliseconds: number): Promise<any> {
    return new Promise((resolve: () => void): any => setTimeout(resolve, milliseconds));
  }
}
